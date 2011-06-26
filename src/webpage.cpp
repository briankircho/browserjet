#include <QDebug>
#include <QWebPage>
#include <QSize>
#include <QString>
#include <QImage>
#include <QPainter>
#include <QPrinter>

#include "webpage.h"

WebPage::WebPage() {
  frame = mainFrame();
  frame->setHtml("<html><head></head><body></body></html>");
  setViewportSize(QSize(1024, 0));
  settings()->setAttribute(QWebSettings::FrameFlatteningEnabled, true);  
  
  frame->setScrollBarPolicy(Qt::Horizontal, Qt::ScrollBarAlwaysOff);
  frame->setScrollBarPolicy(Qt::Vertical, Qt::ScrollBarAlwaysOff);
  
  QObject::connect(frame, SIGNAL(javaScriptWindowObjectCleared()), this, SLOT(addJsCallbackObject()));
  addJsCallbackObject();
}

void WebPage::addJsCallbackObject() {
  frame->addToJavaScriptWindowObject(QString("browserjet"), &jsCallbackObject);
}

QVariant WebPage::run(const QString &js) {
  return frame->evaluateJavaScript(js);
}

void WebPage::get(const QString &url) {
  frame->load(QUrl(url));
}

QString WebPage::html() {
  return frame->toHtml();
}

void WebPage::setHtml(const QString &html) {
  frame->setHtml(html);
}

QImage WebPage::toImage() {
  setViewportSize(QSize(1024, 0));
  setViewportSize(frame->contentsSize());
 
  QImage image(viewportSize(), QImage::Format_ARGB32);
  QPainter painter(&image);
  
  frame->render(&painter);
  painter.end();
  
  return image;
}

void WebPage::savePdf(const QString &path) {
  QPrinter printer;
  printer.setResolution(72);
  printer.setOutputFileName(path);
  printer.setPaperSize(QPrinter::A4);
  printer.setOrientation(QPrinter::Portrait);
  frame->print(&printer);
}

bool WebPage::save(const QString &path) {
  if(path.toLower().endsWith(".pdf")) {
    savePdf(path);
  } else {
    toImage().save(path);
  }
  return true;
}