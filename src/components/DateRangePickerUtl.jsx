import React from "react";

const DateRangePickerUtl = () => {
	return (
		<div className="form-group">
			<DateRangePicker
				startDate={startDate}
				startDateId="your_unique_start_date_id-45"
				endDate={endDate}
				endDateId="your_unique_end_date_id-5554"
				onDatesChange={onDateChange}
				focusedInput={focusedInput}
				onFocusChange={onFocusChange}
				displayFormat="dd, DD MMM"
				firstDayOfWeek={1}
				small={false}
				hideKeyboardShortcutsPanel={true}
				noBorder={true}
				keepOpenOnDateSelect={false}
				reopenPickerOnClearDates={true}
			/>
		</div>
	);
};

export default DateRangePickerUtl;
