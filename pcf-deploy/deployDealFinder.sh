echo "Building DealFinderApp"
echo "cding to home"
cd ../
echo `pwd`
echo "not building, just copying build to pcf-deploy build folder"
#npm i
#npm run build
#echo "build done"

echo "copying build to pcf-deploy"
cp -r ../build ./build

echo "deploying DealFinder to PCF"
cf push dealfinder -b https://github.com/cloudfoundry/nodejs-buildpack

echo "Done pushing react build to PCF!"
