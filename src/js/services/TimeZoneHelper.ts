import moment from "moment/src/moment";
export class TimeZoneHelper {

	private PacificRegion = "America/Los_Angeles";

	constructor(private moment: moment) {
	}

	getCurrentUtcDateTime = () => {
		return this.moment.utc();
	}

	getCurrentPacificDateTime = () => {
		return this.moment.tz(this.PacificRegion);
	}

	convertToPacific = (moment) => {
		let a = this.moment.isMoment(moment) ? moment : this.moment(moment);
		return this.moment.tz(a, this.PacificRegion);
	}

	convertToUtc = (moment) => {
		return this.moment.utc(moment);
	}

	changeTimeZoneComponentToPacific = (moment) => {
		let clone = moment.clone();
		clone = this.moment.tz(clone, this.PacificRegion);
		clone.add(moment.utcOffset() - clone.utcOffset(), 'minutes');
		return clone;
	}
	changeTimeZoneComponentToUniversal = (time) => {
		let timeUtc = this.moment.utc(time.clone());
		timeUtc.add(time.utcOffset(), 'minutes');
		return timeUtc;
	}
	convertUtcToLocal = (time) => {
		let utcDate = this.moment.utc(time.clone());
		let timeLocal = utcDate.local();
		return timeLocal;
	}
}
