echo "Building DealFinderApp"
cd ../
echo pwd
echo
npm run build
echo "build done"

echo "copying build to pcf-deploy"
cp -r ../build ./build

echo "deploying DealFinder to PCF"
cf push dealfinder -b https://github.com/cloudfoundry/nodejs-buildpack

echo "deploying DealFinderAPI to PCF"
cd ../server/APIServer
cf push dealfinderapi -b https://github.com/cloudfoundry/python-buildpack.git -m 1G

echo "Done!"