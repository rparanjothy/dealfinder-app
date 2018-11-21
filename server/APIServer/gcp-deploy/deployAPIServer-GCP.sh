sudo su
alias c=clear
alias l='ls -latr'
apt-get install python-pip
apt-get install git
mkdir /var/dealfinder
cd /var/dealfinder
mkdir APIServer
mkdir APIServer/data
cd ./APIServer
sudo gsutil -m cp -r gs://hd-www-dev-catalog-data/dealfinder/APIServer/* .
sudo gsutil -m cp gs://hd-www-prod-catalog-data/extracts/onlineprice-output/OnlineWas2PriceInventoryExtract.dat	 ./data/OnlineWas2PriceInventoryExtract.del

sudo pip install virtualenv
sudo virtualenv -p python venv
source ./venv/bin/activate

cd /var/dealfinder/APIServer
sudo pip install -r /var/dealfinder/requirements.txt
sudo gunicorn savingsAPI:app --bind 0.0.0.0:80 --workers=3 --timeout 50 --access-logfile /var/dealfinder/dealfinder.log &
