# Catálogo de músicas do site

O player da seção Zenify lê `tracks.json` nesta pasta e toca apenas arquivos de áudio
hospedados aqui. Nada é buscado ou transmitido de serviços de terceiros.

## TODO antes de publicar faixas reais

As três entradas atuais são **placeholders**: os arquivos `faixa-exemplo-*.mp3` ainda
não existem. O player mostra essas faixas como indisponíveis e pula para a próxima.

Cada faixa só pode entrar aqui depois de ter a licença verificada:
CC0, ou uma licença que permita redistribuição com atribuição. Preencha `license`
com a licença exata e `source` com o link de origem.

## Como adicionar uma faixa

1. Copie o arquivo de áudio (mp3 recomendado) para esta pasta.
2. Adicione uma entrada em `tracks.json`:

```json
{
  "title": "Nome da faixa",
  "artist": "Artista",
  "file": "nome-do-arquivo.mp3",
  "license": "CC0 1.0",
  "source": "https://link-da-origem"
}
```

`file` é o caminho relativo a esta pasta. Não use caminhos absolutos nem links externos.
Não é preciso mexer em nenhum código.
