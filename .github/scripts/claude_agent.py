import anthropic, os, json, re
from github import Auth, Github

token = os.environ['GITHUB_TOKEN']
g = Github(auth=Auth.Token(token))
repo = g.get_repo(os.environ['REPO_NAME'])
issue = repo.get_issue(int(os.environ['ISSUE_NUMBER']))
issue_body = os.environ['ISSUE_BODY']

client = anthropic.Anthropic(api_key=os.environ['ANTHROPIC_API_KEY'])

prompt = (
    "Voce modifica arquivos HTML de um sistema de gestao de eventos no GitHub Pages.\n"
    "Instrucao: " + issue_body + "\n\n"
    "Responda SOMENTE com JSON valido sem markdown:\n"
    '{"arquivo": "home.html", "descricao": "resumo", "conteudo": "html completo"}'
)

response = client.messages.create(
    model="claude-opus-4-5",
    max_tokens=8000,
    messages=[{"role": "user", "content": prompt}]
)

raw = response.content[0].text.strip()
raw = re.sub(r'^```json\s*', '', raw)
raw = re.sub(r'^```\s*', '', raw)
raw = re.sub(r'\s*```$', '', raw)
raw = raw.strip()

print("Response:", raw[:300])
result = json.loads(raw)

try:
    f = repo.get_contents(result['arquivo'])
    repo.update_file(result['arquivo'], "Claude: " + result['descricao'], result['conteudo'], f.sha)
    print("Updated:", result['arquivo'])
except Exception as e:
    print("Creating:", e)
    repo.create_file(result['arquivo'], "Claude: " + result['descricao'], result['conteudo'])

issue.create_comment("Feito! `" + result['arquivo'] + "` atualizado.\n\n" + result['descricao'])
issue.edit(state='closed')
print("Done!")
