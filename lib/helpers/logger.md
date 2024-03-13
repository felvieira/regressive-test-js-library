# Logger

O módulo `Logger` fornece uma classe utilitária para logar mensagens no console de forma estruturada e padronizada, facilitando a leitura e o acompanhamento dos logs gerados durante a execução de testes ou qualquer outro processo que necessite de logging.

## Funcionalidades

### Métodos Principais

- **logWithFullLine(message):** Loga uma mensagem delimitada por linhas completas.
- **logWithShortLine(message):** Loga uma mensagem delimitada por linhas curtas.
- **logInitTest(scenario, vp, type):** Loga uma mensagem de início de teste, incluindo informações sobre o cenário, o viewport e o tipo de teste.
- **logFinal(scenario, vp):** Loga uma mensagem indicando o final de um teste.
- **logLine():** Loga uma linha curta separadora.
- **logLineFirst():** Loga uma linha completa no início de um bloco de log.
- **logLineLast():** Loga uma linha completa no final de um bloco de log.

## Exemplo de Uso

### Importando e Utilizando os Métodos de Log

Você pode importar e usar os métodos de log individualmente ou acessar qualquer método através da instância `logger`.

```javascript
const { logInitTest, logFinal, logger } = require('caminho/para/logger');

// Iniciando um log de teste
logInitTest({ label: 'Página de Login' }, { label: 'Desktop' }, 'Funcional');

// Realiza algumas operações aqui...

// Finalizando um log de teste
logFinal({ label: 'Página de Login' }, { label: 'Desktop' });

// Utilizando a instância completa do Logger para um log customizado
logger.logWithFullLine('Teste customizado concluído com sucesso');
```

### Logando Mensagens Personalizadas

Além dos métodos específicos para testes, você pode utilizar os métodos `logWithFullLine` ou `logWithShortLine` para logar mensagens personalizadas.

```javascript
logger.logWithShortLine('Este é um log de exemplo com linha curta');
```

### Personalização

A classe Logger foi projetada para ser flexível. Você pode estender ou modificar o comportamento dos métodos de log conforme necessário para atender aos requisitos específicos do seu projeto.
