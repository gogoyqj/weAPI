if [ $1"x" != "x" ];then
	if [ -d "prd/$1" ];then
		rm -rf prd/$1
	fi
	mkdir prd/$1
	cat weAPI.js > prd/$1/weAPI.js
	cat plugin/plugin.js >> prd/$1/weAPI.js
	cp plugin/generalShare.js prd/$1/
fi