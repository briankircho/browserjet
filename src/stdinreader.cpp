#include <QSocketNotifier>
#include <QTextStream>
#include <QByteArray>
#include <QDebug>

#include <unistd.h>
#include <sys/ioctl.h>
#include <sys/termios.h>
#include <iostream>
#include <string>

#include "json.h"
#include "stdinreader.h"

using namespace std;

StdinReader::StdinReader() {
  ios::sync_with_stdio(false);
  notifier = new QSocketNotifier(STDIN_FILENO, QSocketNotifier::Read, this);
  connect(notifier, SIGNAL(activated(int)), this, SLOT(dataRecieved(int)));
}

void StdinReader::dataRecieved(int status) {
  notifier->setEnabled(false);
  string line;
  while(true) {
    getline(std::cin, line);
    if(line.length() > 0) {
      emit commandReceived(Json::parse(QByteArray(line.data())));
    }
    if(cin.rdbuf()->in_avail() == 0) {
      break;
    }
  }
  notifier->setEnabled(true);
}

