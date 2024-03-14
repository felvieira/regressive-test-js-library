# Salvando o conteúdo da documentação em um arquivo Markdown (.md)

doc_content = """
# Documentação da Classe `FolderCleanup`

A classe `FolderCleanup` é responsável por gerenciar a limpeza de pastas não utilizadas, baseando-se em suas datas. Esta classe é particularmente útil em projetos que geram novos diretórios com base em datas específicas e precisam de uma maneira eficiente de manter apenas os diretórios mais recentes, removendo os antigos para economizar espaço.

## Métodos

### `constructor()`
Inicializa a instância da classe `FolderCleanup` com configurações padrão.

### `convertFolderNameToDate(folderName)`
- **Parâmetros:** `folderName` (string) - O nome da pasta a ser convertido em data.
- **Retorno:** `Date` - Um objeto de data representando a data extraída do nome da pasta.
- **Descrição:** Converte o nome de uma pasta formatado como 'DD_MM_YYYY' para um objeto de data do JavaScript.

### `filterFoldersByDate(folders)`
- **Parâmetros:** `folders` (Array<string>) - Uma lista de nomes de pastas.
- **Retorno:** `Array<string>` - Uma lista filtrada de nomes de pastas que correspondem ao formato de data.
- **Descrição:** Filtra a lista de pastas, mantendo apenas aquelas que correspondem ao formato de data esperado.

### `sortFoldersByDateDescending(folders)`
- **Parâmetros:** `folders` (Array<string>) - Uma lista de nomes de pastas.
- **Retorno:** `Array<string>` - Uma lista de nomes de pastas ordenados por data de forma decrescente.
- **Descrição:** Ordena as pastas com base nas datas extraídas de seus nomes, da mais recente para a mais antiga.

### `deleteOldFolders()`
- **Descrição:** Mantém apenas as três pastas mais recentes, deletando todas as outras. Este método aplica os métodos `filterFoldersByDate` e `sortFoldersByDateDescending` internamente.

### `runCleanup()`
- **Descrição:** Método principal que executa o processo de limpeza, invocando o método `deleteOldFolders`.

## Exemplos de Uso

```javascript
const FolderCleanup = require('./FolderCleanup');

const folderCleanup = new FolderCleanup();
folderCleanup.runCleanup();
```

### Customização

Você pode estender a classe FolderCleanup para atender a requisitos específicos do seu projeto. Por exemplo, você pode sobrescrever o método deleteOldFolders para implementar uma lógica de exclusão diferente ou adicionar novos métodos para lidar com outras tarefas de manutenção de diretórios.
 
