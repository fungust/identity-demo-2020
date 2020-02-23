until mongo --host mongo1 --eval "print(\"waiting for connection to mongo1\")"
do
    sleep 5
done

until mongo --host mongo2 --eval "print(\"waiting for connection to mongo2\")"
do
    sleep 5
done

until mongo --host mongo3 --eval "print(\"waiting for connection to mongo3\")"
do
    sleep 5
done

echo "Running rs initiate..."
# mongo --host mongo --eval "db.createUser({ user: \"<user>\", pwd: \"<pass>\", roles: [ { role: \"root\", db: \"admin\" } ] });"
mongo --host mongo1 --eval "rs.initiate({\"_id\":\"rs0\",\"members\":[{\"_id\":0,\"host\":\"mongo1:27017\"},{\"_id\":1,\"host\":\"mongo2:27017\"},{\"_id\":2,\"host\":\"mongo3:27017\"}]})"
mongo --host mongo2 --eval "rs.initiate({\"_id\":\"rs0\",\"members\":[{\"_id\":0,\"host\":\"mongo1:27017\"},{\"_id\":1,\"host\":\"mongo2:27017\"},{\"_id\":2,\"host\":\"mongo3:27017\"}]})"
mongo --host mongo3 --eval "rs.initiate({\"_id\":\"rs0\",\"members\":[{\"_id\":0,\"host\":\"mongo1:27017\"},{\"_id\":1,\"host\":\"mongo2:27017\"},{\"_id\":2,\"host\":\"mongo3:27017\"}]})"
echo "replicaset run"
