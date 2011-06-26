#ifndef STDINREADER_H
#define STDINREADER_H

#include <QSocketNotifier>
#include <QTextStream>
#include <QVariant>

class StdinReader: public QObject
{
  Q_OBJECT

public:
  StdinReader();
  
private slots:
  void dataRecieved(int status);
  
private:
  QSocketNotifier *notifier;
  
signals:
  void commandReceived(QVariant cmd);

};

#endif // STDINREADER_H
