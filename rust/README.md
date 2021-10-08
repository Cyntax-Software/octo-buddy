# Rust Package

Getting started
```sh
# runs the server
$ cargo run

# runs the web view app
$ cargo run --bin web_view
```

If having an issue installing the `fui_system` crate due missing qmake command:
```sh
# installs qmake
$ brew install qt

# 'QOpenGLWindow' not found
# You may need to update the qmake .pro file to include this library.
# - Find the source: e.g. ~/.cargo/registry/src/github.com-1ecc6299db9ec823/fui_system-0.1.0
# - Add the following to qt_wrapper.pro (/src/platform/qt/qt_wrapper/cpp/qt_wrapper.pro)
$ QT += opengl
```
