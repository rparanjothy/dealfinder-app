cf target -s test
cf push dealfinder-app --no-start 
cf set-env dealfinder-app FORCE_HTTPS true
cf start dealfinder-app