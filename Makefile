XPI=`pwd`/spearch.xpi
xpi:
	if [ -f ${XPI} ] ; then rm ${XPI}; fi
	cd src && zip -r ./../spearch.xpi ./* ; cd ..
