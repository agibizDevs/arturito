# Contribuir

El repositorio de Arturito queda abierto para todos los miembros de [Agibiz Developers en GitHub](https://github.com/agibizDevs).

En la medida que sea posible todo script *complejo* que se quiera agregar debería ser su propio paquete de npm, ya sea el original o un fork con los cambios en esta organización u otra parte. **Una buena regla es que si tu script tiene dependencias debería ser su propio paquete, sino puede ir en la carpeta de scripts.**
## Pre-Requisitos:
- [Git](https://git-scm.com/download/).
- [NodeJS v8.4+](https://nodejs.org/es/download/current/).
- NPM (Viene con NodeJS de forma automatica)
- Tu editor de código favorito. ([VS Code](https://code.visualstudio.com/download), [Atom](https://atom.io/), [Sublime Text](https://www.sublimetext.com/3))

## Pasos:

- Fork a tu cuenta de GitHub y clone este repo en tu local.
- `$ cd ruta/a/arturito`
- `$ npm install` (si usas windows, sudo para MacOS & Linux Distro) - Si estás usando la carpeta de scripts deja tu código en `arturito/scripts`.

--

- Para probar tus cambios localmente: `$ bin/hubot` y activarás a Arturito. Ahora ya podrás invocarlo junto con sus comandos y los que hayas escrito.
- Para enviar tus cambios a Arturito, los pasos son:
  - Haz un [_pull request_](https://github.com/agibizDevs/arturito/pulls) y explica lo que hiciste. Agrega el comando para probarlo en el comentario.
  - Agrega como reviewer a [@chrisdelcaos](https://devsagibiz.slack.com/messages/arturito-devs/team/cvicuna/) y será revisado, testeado, linteado y, si pasa los rigurosos análisis, será agregado.
-  Para más información sobre *Hubot* consulta [Hubot Documentation > Scripting](https://hubot.github.com/docs/scripting/).
-  **No olvides documentar tu código**.
