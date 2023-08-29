

Instalar as dependencias
Rodar yarn install
Rodar yarn build

Ai pra rodar os testes
"URL=SUA_URL_AQUI node ./dist/index.js"


Vc tem um arquivo de configuracoes dentro de lib/config/scenariosConfig
Dentro dele vc deve colocar a url do que quer testar, voce pode passar um script pra simular o compotamento do usuario na pagina em questao, no pageScript.
O custom selectors vc define pra poder acessar dentro do pageScript.



scenariosConfig.json

fullPage: Boleean Tira print da pagina toda em TODOS os breakpoints
target: Seletor tira print do elemento escolhido em TODOS os breakpoints
breakPointFullpage: ["desktop","tablet","phone"] Define se em algum breakpoint vai ter print fullpage
