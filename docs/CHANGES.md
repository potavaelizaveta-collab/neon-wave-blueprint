# Изменения

Оригинал: C:/Users/potav/Desktop/коды/neon-wave-blueprint.

1. Rails-проект перемещён в backend с сохранением внутренней структуры и относительных импортов компонентов.
2. Содержимое public перемещено в frontend без изменения интерфейса, CSS, JavaScript, библиотек и аудиофайлов.
3. Rails public path и SynthController теперь используют frontend. public_root_path в Webpacker обновлён на ../frontend.
4. Исходный README сохранён в docs/README.md. Старые команды в нём описывают прежнюю структуру; актуальные команды приведены в корневом README.md.
5. Добавлены средства запуска в tools. Самостоятельный HTTP-сервер работает на Node.js без дополнительных пакетов.

Все исходные файлы, кроме внутренней истории .git, включены в архив. Из исходных файлов изменены только config/application.rb, app/controllers/synth_controller.rb и config/webpacker.yml. Исходная папка на рабочем столе обновлена. Резервная копия сохранена перед изменением.
