#ifndef WEBPAGE_H
#define WEBPAGE_H

#include <QWebPage>
#include <QWebFrame>
#include <QString>
#include "browserjetobject.h"

class WebPage : public QWebPage
{
  Q_OBJECT

public:
  WebPage();
  QVariant run(const QString &js);
  void get(const QString &url);
  void setHtml(const QString &html);
  QString html();
  bool save(const QString &path);
  BrowserJetObject jsCallbackObject;  

private slots:
  void addJsCallbackObject();

private:
  QWebFrame *frame;
  QImage toImage();
  void savePdf(const QString &path);
};

#endif // WEBPAGE_H
