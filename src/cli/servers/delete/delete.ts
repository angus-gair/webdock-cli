import { colors } from "@cliffy/ansi/colors";
import { Command } from "@cliffy/command";
import { Webdock } from "../../../webdock/webdock.ts";

export const deleteCommand = new Command()
	.description("Delete a server")
	.arguments("<serverSlug:string>")
	.option(
		"-t, --token <token:string>",
		"API token used for authentication (required)",
	)
	.option(
		"--wait",
		"Wait until the server has been fully deleted before exiting",
	)
	.action(async (options, serverSlug) => {
		const client = new Webdock(true);
		const response = await client.servers.delete({
			serverSlug: serverSlug,
			token: options.token,
		});

		if (!response.success) {
			if (response.code == 404) {
				console.error(
					colors.bgRed.bold.underline.italic("Error 404 Server Not Found"),
				);
			} else console.error(colors.bgRed("Sorry, Something went wrong!"));
			Deno.exit(1);
		}

		if (options.wait) {
			await client.waitForEvent(response.data.headers["x-callback-id"]);
			console.log("Server Deleted!");
			Deno.exit(0);
		}

		console.log(
			colors.bgGreen.bold.italic.underline(
				"Server deletion initiated. Please check again in a minute.",
			),
		);
	});
