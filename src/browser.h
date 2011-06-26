#ifndef BROWSER_H
#define BROWSER_H

#include <QtCore>

#include "stdinreader.h"
#include "webpage.h"

class Browser: public QObject {
  Q_OBJECT

  public:
    Browser();
  
  private slots:
    void onCommandReceived(QVariant cmd);
    void onLoadFinished(bool ok);
    void onAsyncScriptCallback(QVariant result);
  
  private:
    StdinReader reader;
    WebPage page;
    QQueue<QVariant> queue;
    
    void next();
    void runCommand(QVariant);
    void sendResponse(const QVariant &response);
    void sendError(const QString &response);
    bool isRunning;
    QString method;
    QVariant id;
};

#endif // BROWSER_H
