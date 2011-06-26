#include <QApplication>
#include <QDebug>
#include <QObject>
#include <QVariant>
#include <QString>
#include <iostream>

#include "browser.h"
#include "json.h"

Browser::Browser() {
  QObject::connect(&reader, SIGNAL(commandReceived(QVariant)), this, SLOT(onCommandReceived(QVariant)));
  QObject::connect(&page, SIGNAL(loadFinished(bool)), this, SLOT(onLoadFinished(bool)));
  QObject::connect(&page.jsCallbackObject, SIGNAL(asyncScriptCallback(QVariant)), this, SLOT(onAsyncScriptCallback(QVariant)));  
  isRunning = false;
}

void Browser::next() {
  if(queue.isEmpty() || isRunning) {
    return;
  }
  runCommand(queue.dequeue());
}

void Browser::runCommand(QVariant cmd) {
  QMap<QString, QVariant> command = cmd.toMap();
  QVariantList params = command.value("params").toList();
  
  method = command.value("method").toString();
  id = command.value("id");
  isRunning = true;
  
  if(method == "run") {
    sendResponse(page.run(params.at(0).toString()));
  } else if(method == "save") {
    sendResponse(page.save(params.at(0).toString()));
  } else if(method == "html") {
    sendResponse(page.html());   
  } else if(method == "runAsync") {
    page.run(params.at(0).toString());
  } else if(method == "get") {
    page.get(params.at(0).toString());
  } else if(method == "setHtml") {
    page.setHtml(params.at(0).toString());
  } else {
    sendError(QString("Unknown Command"));
  }
}

void Browser::sendResponse(const QVariant &response) {
  QMap<QString, QVariant> json;
  json["result"] = response;
  json["id"] = id;
  std::cout << Json::stringify(json).data() << std::endl << std::flush;
  isRunning = false;
  next();
}

void Browser::sendError(const QString &response) {
  QMap<QString, QVariant> json;
  json["error"] = response;
  json["id"] = id;
  std::cout << Json::stringify(json).data() << std::endl << std::flush;
  QApplication::exit(1);
}

void Browser::onCommandReceived(QVariant cmd) {
  queue.enqueue(cmd);
  next();
}

void Browser::onLoadFinished(bool ok) {
  if(method == "get" || method == "setHtml") {
    sendResponse(ok);
  }
}

void Browser::onAsyncScriptCallback(QVariant result) {
  if(method == "runAsync") {
    sendResponse(result);
  }
}
