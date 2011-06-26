#!/usr/bin/env python
import sys, platform, os

if not sys.platform.startswith('linux'):
  sys.exit("Only Linux 32/64 are currently supported by the browserjet installer")

host = "http://releases.browserjet.com/"
filename = "browserjet-linux-"+platform.architecture()[0]+"-latest.tar.bz2"
url = host+filename

os.chdir(os.path.dirname(__file__))
os.system("wget -- "+url);
os.system("rm -rf bin/*");
os.system("tar -jvxf "+filename);
os.system("rm -rf "+filename);
