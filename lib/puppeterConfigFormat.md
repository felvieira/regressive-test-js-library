# ScenarioFormatter

A classe `ScenarioFormatter` é utilizada para formatar cenários de testes, considerando diferentes viewports (resoluções de tela) e gerando nomes de arquivos e caminhos padronizados para armazenamento de screenshots e outros artefatos de teste.

## Funcionalidades

### Métodos Principais

- **constructor(scenario, viewPort):** Construtor da classe que recebe um `scenario` (cenário de teste) e um `viewPort` (viewport para o teste).
- **formatName(viewPort, label):** Método estático que gera um nome formatado para o arquivo com base no viewport e no rótulo do cenário. O nome é gerado em maiúsculas e espaços ou caracteres especiais são substituídos por underscores.
- **existsInPath(referencePathFolder, referenceImage):** Verifica se uma imagem de referência existe no caminho especificado.
- **getFolderPath(referencePathFolder, referenceImage):** Obtém o nome da pasta onde a imagem deve ser salva. Se a imagem de referência já existir, a pasta será nomeada com a data atual; caso contrário, será utilizada a pasta 'reference'.
- **formatComplete():** Formata completamente um cenário, incluindo o nome do arquivo de imagem, caminhos de arquivos e tipo (referência ou teste).

## Exemplo de Uso

```javascript
const { formatScenario } = require('./ScenarioFormatter');

const scenario = {
  label: 'Página de Login',
  url: 'https://example.com/login',
};

const viewPort = {
  label: 'Desktop',
  width: 1920,
  height: 1080,
};

async function formatTestScenario() {
  const formattedScenario = await formatScenario(scenario, viewPort);
  console.log(formattedScenario);
}

formatTestScenario();
```

Este exemplo demonstra como formatar um cenário de teste para a 'Página de Login' em um viewport 'Desktop'. O método `formatScenario` retornará um objeto com informações formatadas, incluindo o nome do arquivo de imagem, caminhos de arquivo e o tipo de cenário (teste ou referência).

## Personalização

Você pode estender a classe `ScenarioFormatter` para incluir lógicas adicionais de formatação conforme as necessidades específicas de seu projeto de teste.
