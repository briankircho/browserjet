#ifndef BROWSERJETOBJECT_H
#define BROWSERJETOBJECT_H

#include <QtCore>

class BrowserJetObject: public QObject {
  Q_OBJECT

  public slots:
    void callback(const QVariant &result);

  signals:
    void asyncScriptCallback(QVariant result);
};

#endif // BROWSERJETOBJECT_H
