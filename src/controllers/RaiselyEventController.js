const { AirblastController } = require('airblast');
const yup = require('yup');

// Sync donations
// - every time reconciliation in event is updated
// - when a donation is created for a guest record
// - every time a donation is updated (maybe with debouncing?)

// Sync suvery data to existing backend
// - every time a guest is saved (don't send identifying details though, just send a user hash (not uuid))

// So receives raisely events for
// EventRsvp Created
// Donation Updated
// Event Updated

const schema = {
	type: yup.string().required(),
};

class RaiselyEventController extends AirblastController {
	// eslint-disable-next-line class-methods-use-this
	async validate({ data }) {
		renameGsxKeys(data);

		validate(payloadSchema, data);

		// Convert dates to iso
		if (!data.conversationdate) throw new this.AppError(400, 'invalid', 'Cannot process a conversation that does not have a date');
		dateKeys.forEach((key) => {
			data[key] = data[key] ? sheetsToIsoDate(data[key]) : null;
		});
	}

	// eslint-disable-next-line class-methods-use-this
	async process({ key }) {
		const promises = [
			this.controllers.ftlGuest.enqueue({ guestKey: key }),
			this.controllers.keplaGuest.enqueue({ guestKey: key }),
		];

		try {
			await Promise.all(promises);
		} finally {
			// eslint-disable-next-line no-console
			Promise.all(promises.map(p => p && p.catch(console.error)));
		}
	}
}

/**
  * Remove gsx$ from google sheet data keys
  * @param {object} data Original data from google sheets
  * NOTE: Modifies the existing data object
  */
function renameGsxKeys(data) {
	Object.keys(data).forEach((k) => {
		const newKey = k.split('gsx$').join('');

		if (data[newKey]) throw new Error(`Key exists! Won't overwrite ${newKey}`);

		data[newKey] = data[k];

		delete data[k];
	});
}

module.exports = GuestController;
