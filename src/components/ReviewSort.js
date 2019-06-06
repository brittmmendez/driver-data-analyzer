import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import Select from 'react-select';

const customStyles = {
	// option: (styles, state) => ({
	// 	...styles,
	// 	color: state.isSelected ? "#FFF" : styles.color,
	// 	backgroundColor: state.isSelected ? "#F3969A" : styles.color,
	// 	borderBottom: "1px solid rgba(0, 0, 0, 0.125)",
	// 	"&:hover": {
	// 		color: "#FFF",
	// 		backgroundColor: "#F3969A"
	// 	}
	// }),
	control: (styles, state) => ({
		...styles,
		boxShadow: "none",
		borderColor: "#002C73",
		borderRadius: "1px 0 0 1px",
		borderImage: state.menuIsOpen ? "linear-gradient(to left, #002C73 0%, #3F9EDF 100%)" : "",
		borderImageSlice: state.menuIsOpen ? "1" : "",
		borderWidth: state.menuIsOpen ? "4px" : "1px",
		backgroundColor: "transparent",
		"&:hover": {
			color: "#002C73",
		}
	})
};

@inject('shop')
@observer
export default class ReviewSort extends Component {
	static propTypes = {
		product: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
		handlePageChange: PropTypes.func.isRequired // eslint-disable-line react/forbid-prop-types
	};

	constructor(props) {
		super(props);
		this.state = {
			selectedOption: { value: 'mostRecent', label: 'Most Recent' },
			options: [
				{ value: 'mostRecent', label: 'Most Recent' },
				{ value: 'lowHigh', label: 'Low to High' },
				{ value: 'highLow', label: 'High to Low' },
			],
		};
	}

	handleSortChange = (selectedOption) => {
		this.setState({ selectedOption });
		const { product, handlePageChange } = this.props;
		product.updateReviewSort(selectedOption.value);
		handlePageChange(1);
	}

	render() {
		const { selectedOption, options } = this.state

		return (
			<div className="filter">
				<Select
					styles={customStyles}
					defaultValue={options[0]}
					value={selectedOption}
					onChange={this.handleSortChange}
					options={options}
					isSearchable={false}
					name="option"

				/>
			</div>
		);
	}
}

