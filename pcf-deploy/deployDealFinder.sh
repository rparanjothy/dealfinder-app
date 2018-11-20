echo "Building DealFinderApp"
cd ../
echo `pwd`
echo
npm i
npm run build
echo "build done"

echo "copying build to pcf-deploy"
cp -r ../build ./build

echo "deploying DealFinder to PCF"
cf push dealfinder -b https://github.com/cloudfoundry/nodejs-buildpack

echo "deploying DealFinderAPI to PCF"
cd ../server/APIServer
gsutil -m cp hd-www-prod-catalog-data/extracts/onlineprice-output/OnlineWas2PriceInventoryExtract.dat ./data/OnlineWas2PriceInventoryExtract.del
cf push dealfinderapi -b https://github.com/cloudfoundry/python-buildpack.git -m 1G -k 2GB

echo "Done!"
