# neon-wave-blueprint

Проект организован ровно в четыре основные папки:

- backend — Rails, все React-компоненты и девять прототипов, настройки, тесты, база данных и служебные файлы.
- frontend — исходный public: интерфейс, JavaScript, CSS, изображения, WAV и локальная Tone.js.
- docs — исходный README и описание изменений.
- tools — запуск Rails и самостоятельного интерфейса.

Для основной HTML-версии установите Node.js и запустите tools/start-frontend.cmd. Откройте http://localhost:3000. Для Rails: из backend выполните bundle install, затем bundle exec rails db:prepare и bundle exec rails server; либо используйте tools/start-rails.cmd после установки зависимостей.

Образец pelagic-synth-main.zip использован как ориентир для простой структуры веб-интерфейса. Его код не заменяет исходный проект.
