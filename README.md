# Demo Application on OpenShift using Mobile Response APIs

An AngularJS app that directly calls [Mobile Response APIs](http://mobileresponse.com/) for creating units.

## OpenShift Quick Deployment

1. Create a JBoss EAP 6 application on OpenShift using this repo as the source code

	```shell
	rhc app create mobileresponsedemo jbosseap-6 --from-code https://github.com/siamaksade/openshift-mobileresponse.git
	```

2. Update *src/main/webapp/js/Factories/VisitorsFactory.js* with your Mobile Response credentials:

	```javascript
	var credentials = {
			'userName': 'myusername',
			'password': 'mypassword'
	};
	```

3. Push the changes to OpenShift application's git repo

	```shell
	git add src/main/webapp/js/Factories/VisitorsFactory.js
	git commit -m "credentials updated"
	git push
	```

2. Browse to

 http://mobileresponsedemo-[yourdomain].rhcloud.com/#/navigation/+46731111111
