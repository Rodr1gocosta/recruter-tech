# 🚀 Guia Rápido - Recruter Tech

## ⚡ Início Rápido (3 passos)

### 1. Configure a API Key da OpenAI

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite e adicione sua chave
nano .env  # ou use seu editor preferido
```

No arquivo `.env`, adicione:
```
OPENAI_API_KEY=sk-sua-chave-real-aqui
```

> 💡 Obtenha sua chave em: https://platform.openai.com/api-keys

### 2. Inicie a aplicação

**Linux/Mac:**
```bash
./start.sh
```

**Windows:**
```bash
start.bat
```

**Ou manualmente:**
```bash
docker-compose up -d
```

### 3. Acesse a aplicação

Abra seu navegador em: **http://localhost**

---

## 📖 Como Usar

### Passo 1: Informações Iniciais
1. Preencha os dados do candidato
2. Selecione a vaga
3. Faça upload do currículo em PDF
4. Clique em "Próxima Etapa"

### Passo 2: Experiência (15 min)
Durante a entrevista, anote:
- Use o **Guia de Experiência** lateral para:
  - ✅ Marcar os tópicos já abordados (checkboxes)
  - 📝 Ver exemplos de cada categoria
  - 🎯 Garantir que cobriu todos os pontos importantes
- **Experiências principais** do candidato
- **Tecnologias** que ele domina (Java, Spring Boot, etc.)
- **Desafios** que ele resolveu
- **Pontos fortes** que você percebeu
- Avalie a **comunicação** dele

**Dica:** O guia tem 15 categorias específicas para desenvolvedores Java. Marque conforme for cobrindo cada tópico!

### Passo 3: Avaliação Técnica (15 min)
1. Faça as perguntas técnicas pré-definidas
2. Para cada pergunta, dê uma nota de 0 a 5
3. Anote observações sobre as respostas
4. O sistema calcula a pontuação automaticamente

### Passo 4: Gerar Relatório
1. Adicione suas notas finais sobre o candidato
2. Indique se ele é APROVADO ou NÃO APROVADO
3. Clique em "Gerar Relatório com IA"
4. Aguarde alguns segundos
5. Baixe o PDF profissional gerado

---

## 🎯 Dicas Importantes

### ✅ Boas Práticas
- **Seja objetivo** nas anotações de experiência
- **Liste tecnologias** de forma clara e separada
- **Avalie criteriosamente** cada resposta técnica (0 a 5)
- **Seja justo** - use toda a escala de pontuação
- **Notas finais claras** - justifique sua recomendação

### ⚠️ Atenção
- O currículo deve estar em formato **PDF**
- Tamanho máximo: **5MB**
- Tenha sua **API Key da OpenAI** configurada
- Certifique-se de ter **créditos disponíveis** na OpenAI

---

## ⚙️ Customização

### Mudar as Perguntas Técnicas

Edite: `backend/data/questions.json`

```json
{
  "categories": [
    {
      "id": "sua-categoria",
      "name": "Nome da Categoria",
      "questions": [
        {
          "id": 1,
          "question": "Sua pergunta aqui?",
          "maxScore": 5
        }
      ]
    }
  ]
}
```

Depois, reinicie o backend:
```bash
docker-compose restart backend
```

### Mudar Cores do Sistema

Edite: `frontend/tailwind.config.js`

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        600: '#sua-cor-aqui',
        // ...
      }
    }
  }
}
```

Rebuild o frontend:
```bash
docker-compose up -d --build frontend
```

---

## 🔧 Comandos Úteis

### Ver logs em tempo real
```bash
docker-compose logs -f
```

### Ver apenas logs do backend
```bash
docker-compose logs -f backend
```

### Parar a aplicação
```bash
docker-compose down
```

### Rebuild após mudanças
```bash
docker-compose up -d --build
```

### Ver status dos containers
```bash
docker-compose ps
```

### Limpar tudo e começar do zero
```bash
docker-compose down -v
docker-compose up -d --build
```

---

## ❓ Problemas Comuns

### "Erro ao gerar relatório"
**Causa:** API Key da OpenAI inválida ou sem créditos

**Solução:** 
1. Verifique o arquivo `.env`
2. Confirme que a chave está correta
3. Verifique seus créditos em: https://platform.openai.com/account/usage

### "Erro ao fazer upload"
**Causa:** Arquivo não é PDF ou é maior que 5MB

**Solução:** 
1. Certifique-se que o arquivo é um PDF válido
2. Comprima o PDF se necessário

### "Frontend não carrega"
**Causa:** Container não está rodando

**Solução:**
```bash
docker-compose ps  # Ver status
docker-compose up -d  # Iniciar novamente
docker-compose logs frontend  # Ver erros
```

### "Backend não responde"
**Causa:** Container parado ou erro no código

**Solução:**
```bash
docker-compose logs backend  # Ver erro
docker-compose restart backend  # Reiniciar
```

---

## 📞 Precisa de Ajuda?

1. Consulte o [README.md](README.md) completo
2. Verifique os logs: `docker-compose logs -f`
3. Abra uma issue no repositório

---

**Boas entrevistas! 🎯**
