import { Webdock } from "../../../webdock/webdock.ts";
import { colors } from "@cliffy/ansi/colors";
import { sleep } from "../../../utils/sleep-with-useless-fact.ts";
import { Table } from "@cliffy/table";

export async function metricsService(PARENT: () => void, slug: string) {
	while (true) {
		const client = new Webdock(false);
		const response = await client.servers.metrics({
			now: true,

			serverSlug: slug,
		});

		if (!response.success) {
			console.error(response.error);
			return PARENT();
		}

		const body = response.data.body;
		const isNow = true;

		// Extract Disk metrics
		const diskAllowed = body.disk.allowed;
		let diskUsed: number, diskTimestamp: string;
		if (isNow) {
			// @ts-expect-error:
			diskUsed = body.disk.lastSamplings.amount;
			// @ts-expect-error:
			diskTimestamp = body.disk.lastSamplings.timestamp;
		} else {
			const latestDisk = body.disk.samplings.slice(-1)[0];
			diskUsed = latestDisk.amount;
			diskTimestamp = latestDisk.timestamp;
		}

		// Extract Network metrics
		const networkAllowed = body.network.allowed;
		let networkInUsed: number, networkInTimestamp: string;
		let networkOutUsed: number, networkOutTimestamp: string;
		if (isNow) {
			// @ts-expect-error:
			networkInUsed = body.network.latestIngressSampling.amount;
			// @ts-expect-error:
			networkInTimestamp = body.network.latestIngressSampling.timestamp;
			// @ts-expect-error:
			networkOutUsed = body.network.latestEgressSampling.amount;
			// @ts-expect-error:
			networkOutTimestamp = body.network.latestEgressSampling.timestamp;
		} else {
			const latestIngress = body.network.ingressSamplings.slice(-1)[0];
			networkInUsed = latestIngress.amount;
			networkInTimestamp = latestIngress.timestamp;
			const latestEgress = body.network.egressSamplings.slice(-1)[0];
			networkOutUsed = latestEgress.amount;
			networkOutTimestamp = latestEgress.timestamp;
		}

		// Extract CPU metrics
		let cpuUsed: number, cpuTimestamp: string;
		if (isNow) {
			// @ts-expect-error:
			cpuUsed = body.cpu.latestUsageSampling.amount;
			// @ts-expect-error:
			cpuTimestamp = body.cpu.latestUsageSampling.timestamp;
		} else {
			const latestCpu = body.cpu.usageSamplings.slice(-1)[0];
			cpuUsed = latestCpu.amount;
			cpuTimestamp = latestCpu.timestamp;
		}

		// Extract Processes metrics
		let processesUsed: number, processesTimestamp: string;
		if (isNow) {
			// @ts-expect-error:
			processesUsed = body.processes.latestProcessesSampling.amount;
			// @ts-expect-error:
			processesTimestamp = body.processes.latestProcessesSampling.timestamp;
		} else {
			const latestProcesses = body.processes.processesSamplings.slice(-1)[0];
			processesUsed = latestProcesses.amount;
			processesTimestamp = latestProcesses.timestamp;
		}

		// Extract Memory metrics
		let memoryUsed: number, memoryTimestamp: string;
		if (isNow) {
			// @ts-expect-error:
			memoryUsed = body.memory.latestUsageSampling.amount;
			// @ts-expect-error:
			memoryTimestamp = body.memory.latestUsageSampling.timestamp;
		} else {
			const latestMemory = body.memory.usageSamplings.slice(-1)[0];
			memoryUsed = latestMemory.amount;
			memoryTimestamp = latestMemory.timestamp;
		}
		console.clear();

		console.log(
			colors.bgGreen(
				"This Screen wil update every 5 seconds showing realtime metrics",
			),
		);
		console.log(colors.bgGreen("you can't go back from here"));
		console.log(colors.bgGreen("Kill the session, and enter webdock again"));

		// Build and display the table
		new Table()
			.header(["Metric", "Used", "Allowed", "Timestamp"])
			.body([
				["Disk", `${diskUsed}`, `${diskAllowed}`, diskTimestamp],
				[
					"Network In",
					`${networkInUsed}`,
					`${networkAllowed}`,
					networkInTimestamp,
				],
				[
					"Network Out",
					`${networkOutUsed}`,
					`${networkAllowed}`,
					networkOutTimestamp,
				],
				["CPU", `${cpuUsed}`, "-", cpuTimestamp],
				["Processes", `${processesUsed}`, "-", processesTimestamp],
				["Memory", `${memoryUsed}`, "-", memoryTimestamp],
			])
			.border(true)
			.render();
		await sleep(5);
	}
}
