# Classe TestApprover

Esta classe é responsável por aprovar os testes realizados, copiando as imagens dos testes da pasta temporária para a pasta de referência, após a aprovação. Arquivos redimensionados (marcados como 'resized') são excluídos e não copiados para a pasta de referência.

## Métodos

### `deleteResizedReferenceFiles()`

Exclui arquivos redimensionados da pasta de referência.

### `copyTestImagesToReference(testFolderName)`

Copia imagens de teste para a pasta de referência, excluindo as imagens redimensionadas.

### `getFolderPath(folderName)`

Retorna o caminho completo de uma pasta dada o nome.

### `approveTests()`

Inicia o processo de aprovação dos testes. Se aprovado, as imagens de teste são copiadas para a pasta de referência.

## Uso

```javascript
const runApproveTest = require('./TestApprover');

runApproveTest().then(() => console.log('Processo de aprovação concluído.'));
```
