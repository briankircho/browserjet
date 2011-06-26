#include <QApplication>
#include <QDebug>
#include "browser.h"

int main(int argv, char **args) {
  QApplication app(argv, args);
  Browser browser;
  return app.exec();
}
