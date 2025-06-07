export default [
	{
		value: "START",
		name: `Power On - Start the server if it's offline`,
	},
	{
		value: "STOP",
		name: `Power Off - Safely shut down the server`,
	},
	{
		value: "REBOOT",
		name: `Restart - Perform a full system reboot`,
	},
	{
		value: "DELETE",
		name: `Delete - Permanent removal (irreversible!)`,
	},
	{
		value: "RESIZE",
		name: `Resize - Upgrade server resources`,
	},
	{
		value: "FETCH",
		name: `Download File - Retrieve a file from the server`,
	},
	{
		value: "SCRIPTS",
		name: `Server Scripts`,
	},
	{
		value: "SNAPSHOTS",
		name: `Snapshots - Create, list, or restore snapshots`,
	},

	{
		value: "REINSTALL",
		name: `Reinstall OS - Fresh system installation`,
	},
	{
		value: "ARCHIVE",
		name: `Archive Server - Put this server in cold storage and free up resources and IPs`,
	},
	{
		value: "METRICS",
		name: `Server Metrics - View CPU/Memory/Disk usage`,
	},
	{
		value: "SHELL",
		name: `Shell Users - Create/list/Delete shell users`,
	},
	{
		value: "EXIT",
		name: `<- Go Back`,
	},
];
