DATE = `date "+%Y-%m-%d"`
all:
	@npx npm-license-crawler --dependencies --production --onlyDirectDependencies --omitVersion --json ./licenses.json
	echo $(DATE)
	sed "s/\"version\": \".*\"/\"version\": \"$(DATE)\"/" -i app.json
	eas update
	#eas build --platform all
