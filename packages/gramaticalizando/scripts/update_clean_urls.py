import os
import re

PUBLIC_DIR = r"D:\WORKSPACE\SANDBOX\apps\axion-client-apps\packages\gramaticalizando\public"

EXACT_URL_MAP = {
    "/pages/login.html": "/login",
    "/pages/registro.html": "/registro",
    "/pages/home.html": "/home",
    "/pages/diagnostico.html": "/diagnostico",
    "/pages/portugues.html": "/portugues",
    "/pages/portugues-conteudo.html": "/portugues-conteudo",
    "/pages/redacao.html": "/redacao",
    "/pages/videoaulas.html": "/videoaulas",
    "/pages/simulados.html": "/simulados",
    "/pages/simulado-conteudo.html": "/simulado-conteudo",
    "/pages/materiais.html": "/materiais",
    "/pages/cronograma.html": "/cronograma",
    "/pages/perfil.html": "/perfil",
    "/pages/configuracoes.html": "/configuracoes",
    "/pages/index.html": "/",
    "/index.html": "/",
    
    # Professor
    "/professor/index.html": "/professor",
    "/professor/alunos.html": "/professor/alunos",
    "/professor/configuracoes.html": "/professor/configuracoes",
    "/professor/correcoes.html": "/professor/correcoes",
    "/professor/cronograma.html": "/professor/cronograma",
    "/professor/diagnosticos.html": "/professor/diagnosticos",
    "/professor/materiais.html": "/professor/materiais",
    "/professor/perfil.html": "/professor/perfil",
    "/professor/planos.html": "/professor/planos",
    "/professor/portugues-criar.html": "/professor/portugues-criar",
    "/professor/portugues.html": "/professor/portugues",
    "/professor/redacoes.html": "/professor/redacoes",
    "/professor/simulados-criar.html": "/professor/simulados-criar",
    "/professor/simulados.html": "/professor/simulados",
    "/professor/videoaulas.html": "/professor/videoaulas",
    
    # Admin
    "/admin.html": "/admin",
    "/admin-login.html": "/admin-login"
}

def clean_content(content, filepath):
    is_in_pages = "\\public\\pages" in filepath
    is_in_prof = "\\public\\professor" in filepath
    
    # Substituições exatas primeiro
    for old, new in EXACT_URL_MAP.items():
        content = content.replace(f'href="{old}"', f'href="{new}"')
        content = content.replace(f"href='{old}'", f"href='{new}'")
        content = content.replace(f'href=`{old}`', f'href=`{new}`')
        content = content.replace(f'"{old}"', f'"{new}"')
        content = content.replace(f"'{old}'", f"'{new}'")
        content = content.replace(f'`{old}`', f'`{new}`')

    # Se estiver em pages/
    if is_in_pages:
        for page in ["home", "login", "registro", "diagnostico", "portugues", "portugues-conteudo", 
                     "redacao", "videoaulas", "simulados", "simulado-conteudo", "materiais", 
                     "cronograma", "perfil", "configuracoes"]:
            content = re.sub(rf'href=([\'"])\.\/{page}\.html\1', rf'href=\1/{page}\1', content)
            content = re.sub(rf'href=([\'"]){page}\.html\1', rf'href=\1/{page}\1', content)
            content = re.sub(rf'([\'"`])\.\/{page}\.html\1', rf'\1/{page}\1', content)
            content = re.sub(rf'([\'"`])\.\/{page}\.html\?', rf'\1/{page}?', content)
            content = re.sub(rf'([\'"`])\.\.\/pages\/{page}\.html\1', rf'\1/{page}\1', content)
            content = re.sub(rf'([\'"`])\.\.\/pages\/{page}\.html\?', rf'\1/{page}?', content)
        
        content = re.sub(r'href=([\'"])\.\.\/index\.html\1', r'href=\1/\1', content)
        content = re.sub(r'href=([\'"])\.\/index\.html\1', r'href=\1/\1', content)
        content = re.sub(r'([\'"`])\.\.\/index\.html\1', r'\1/\1', content)

    # Se estiver em professor/
    if is_in_prof:
        for page in ["alunos", "configuracoes", "correcoes", "cronograma", "diagnosticos", 
                     "materiais", "perfil", "planos", "portugues-criar", "portugues", 
                     "redacoes", "simulados-criar", "simulados", "videoaulas"]:
            content = re.sub(rf'href=([\'"])\.\/{page}\.html\1', rf'href=\1/professor/{page}\1', content)
            content = re.sub(rf'href=([\'"]){page}\.html\1', rf'href=\1/professor/{page}\1', content)
            content = re.sub(rf'([\'"`])\.\/{page}\.html\1', rf'\1/professor/{page}\1', content)
            content = re.sub(rf'([\'"`])\.\/{page}\.html\?', rf'\1/professor/{page}?', content)
        
        content = re.sub(r'href=([\'"])\.\/index\.html\1', r'href=\1/professor\1', content)
        content = re.sub(r'href=([\'"])index\.html\1', r'href=\1/professor\1', content)
        content = re.sub(r'([\'"`])\.\/index\.html\1', r'\1/professor\1', content)

    return content

total_changed = 0
for root, dirs, files in os.walk(PUBLIC_DIR):
    for f in files:
        if f.endswith(('.html', '.js')):
            full_path = os.path.join(root, f)
            with open(full_path, 'r', encoding='utf-8') as file:
                old_content = file.read()
            
            new_content = clean_content(old_content, full_path)
            if new_content != old_content:
                with open(full_path, 'w', encoding='utf-8') as file:
                    file.write(new_content)
                total_changed += 1
                print(f"Updated: {os.path.relpath(full_path, PUBLIC_DIR)}")

print(f"Total files updated: {total_changed}")
