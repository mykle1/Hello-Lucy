#!/usr/bin/env bash

# Magic Mirror
# Module: MMM-VoiceControlMe
#
# Edited, modified and extended by @TheStigh, @Mykle1 and @sdetweil
# https://github.com/mykle1/MMM-VoiceControlMe
#
# Based on fewieden https://github.com/fewieden/MMM-voice
# MIT Licensed.

echo -e "\e[0m"
echo '  Installing dependencies for Hello-Lucy...This may take a while on a Pi'
echo -e "\e[0m"


# installing packages
echo -e "\e[96m[STEP 1/5] Installing Packages\e[90m"
if sudo apt-get install bison libasound2-dev autoconf automake libtool python-dev swig python-pip -y ;
then
    echo -e "\e[32m[STEP 1/5] Installing Packages | Done\e[0m"
else
	echo -e "\e[31m[STEP 1/5] Installing Packages | Failed\e[0m"
	exit;
fi


# installing sphinxbase
echo -e "\e[96m[STEP 2/5] Installing sphinxbase\e[90m"
cd ~
if [ ! -d "$HOME/sphinxbase" ] ;
then
    if ! git clone https://github.com/cmusphinx/sphinxbase.git ;
    then
        echo -e "\e[31m[STEP 2/5] Installing sphinxbase | Failed\e[0m"
        exit;
    fi
fi

cd sphinxbase
if ! git pull ;
then
    echo -e "\e[31m[STEP 2/5] Installing sphinxbase | Failed\e[0m"
    exit;
fi

./autogen.sh
./configure --enable-fixed
make
sudo make install
echo -e "\e[32m[STEP 2/5] Installing sphinxbase | Done\e[0m"


# installing pocketsphinx
echo -e "\e[96m[STEP 3/5] Installing pocketsphinx\e[90m"
cd ~
if [ ! -d "$HOME/pocketsphinx" ] ;
then
    if ! git clone https://github.com/cmusphinx/pocketsphinx.git ;
    then
        echo -e "\e[31m[STEP 3/5] Installing pocketsphinx | Failed\e[0m"
        exit;
    fi
fi

cd pocketsphinx
if ! git pull ;
then
    echo -e "\e[31m[STEP 3/5] Installing pocketsphinx | Failed\e[0m"
    exit;
fi

./autogen.sh
./configure
make
sudo make install
echo -e "\e[32m[STEP 3/5] Installing pocketsphinx | Done\e[0m"


# exporting paths
echo -e "\e[96m[STEP 4/5] Exporting paths\e[0m"
echo "export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/lib" >> ~/.bashrc
echo "export PKG_CONFIG_PATH=$PKG_CONFIG_PATH:/usr/local/lib/pkgconfig" >> ~/.bashrc
echo -e "\e[32m[STEP 4/5] Exporting paths |  Done\e[0m"


# installing npm dependencies
echo -e "\e[96m[STEP 5/5] Installing npm dependencies\e[90m"
cd ~/MagicMirror/modules/Hello-Lucy
if npm install --productive;
then
    echo -e "\e[32m[STEP 5/5] Installing npm dependencies | Done\e[0m"
else
    echo -e "\e[31m[STEP 5/5] Installing npm dependencies | Failed\e[0m"
    exit;
fi

# modifying installed PocketSphinx
#    echo -e "\e[32mModifying pocketsphinx | Done\e[0m"
# cp psc/*.* node_modules/pocketsphinx-continuous/


# displaying audio devices
echo -e "\e[96m[INFO] Possible Audio Devices to set in config.js\n\e[0m"
cat /proc/asound/cards
