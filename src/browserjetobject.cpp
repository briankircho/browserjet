#include <QDebug>
#include <QString>
#include <QVariant>

#include "browserjetobject.h"
#include "json.h"

void BrowserJetObject::callback(const QVariant &result) {
  emit asyncScriptCallback(result);
}

