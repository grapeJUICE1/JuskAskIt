import classNames from 'classnames';
import React, { useState } from 'react';
import { Col, ButtonGroup, ToggleButton } from 'react-bootstrap';
import styles from './SortButtons.module.scss';

const SortButtons = (props) => {
  const sortOptions = [
    { label: ' All ', func: props.removeFilter },
    { label: 'Newest', func: props.sortNewest },
    { label: 'Oldest', func: props.sortOldest },
    { label: 'Votes', func: props.sortByVotes },
    { label: 'Views', func: props.sortByViews },
    { label: 'Unanswered', func: props.filterUnanswered },
    { label: 'Popularity', func: props.sortByPopularity },
  ];
  const [radioValue, setRadioValue] = useState(1);
  return (
    <Col
      lg={7}
      className={classNames({
        'mt-lg-4 d-flex justify-content-lg-end': true,
        'pt-lg-5 ': !props.isUser,
        [`${styles.col_sort_buttons}`]: !props.isProfile,
        [`${styles.col_sort_buttons_for_profile}`]: props.isProfile,
        [`${styles.col_sort_buttons_for_users_page}`]: props.isUser,
      })}
    >
      <div>
        <ButtonGroup toggle className="flex-wrap">
          {sortOptions.map((srtOpt, key) => {
            if (!srtOpt.func) return null;

            return (
              <ToggleButton
                value={key}
                key={key}
                type="radio"
                checked={
                  props.filterTag
                    ? key === 0
                      ? false
                      : radioValue === key
                    : radioValue === key
                }
                onChange={(e) => setRadioValue(Number(e.currentTarget.value))}
                variant="outline-dark"
                className={'rounded-0 px-1 ' + styles.sort_buttons}
                size="sm"
                onClick={srtOpt.func}
              >
                {srtOpt.label}
              </ToggleButton>
            );
          })}
        </ButtonGroup>
        <br />
        {props.showInfo ? (
          <small className="text-warning">
            *pressing all will reset your filters{' '}
          </small>
        ) : (
          ''
        )}
      </div>
    </Col>
  );
};

export default SortButtons;
