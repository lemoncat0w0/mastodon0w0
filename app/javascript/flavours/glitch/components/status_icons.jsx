//  Package imports.
import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { defineMessages, injectIntl } from 'react-intl';

import ImmutablePropTypes from 'react-immutable-proptypes';

import { ReactComponent as ExpandLessIcon } from '@material-symbols/svg-600/outlined/expand_less.svg';
import { ReactComponent as ForumIcon } from '@material-symbols/svg-600/outlined/forum.svg';
import { ReactComponent as HomeIcon } from '@material-symbols/svg-600/outlined/home.svg';

import { Icon } from 'flavours/glitch/components/icon';
import { languages } from 'flavours/glitch/initial_state';

import { IconButton } from './icon_button';
import { VisibilityIcon } from './visibility_icon';

const messages = defineMessages({
  collapse: { id: 'status.collapse', defaultMessage: 'Collapse' },
  uncollapse: { id: 'status.uncollapse', defaultMessage: 'Uncollapse' },
  inReplyTo: { id: 'status.in_reply_to', defaultMessage: 'This toot is a reply' },
  previewCard: { id: 'status.has_preview_card', defaultMessage: 'Features an attached preview card' },
  pictures: { id: 'status.has_pictures', defaultMessage: 'Features attached pictures' },
  poll: { id: 'status.is_poll', defaultMessage: 'This toot is a poll' },
  video: { id: 'status.has_video', defaultMessage: 'Features attached videos' },
  audio: { id: 'status.has_audio', defaultMessage: 'Features attached audio files' },
  localOnly: { id: 'status.local_only', defaultMessage: 'Only visible from your instance' },
});

const LanguageIcon = ({ language }) => {
  if (!languages) return null;

  const lang = languages.find((lang) => lang[0] === language);
  if (!lang) return null;

  return (
    <span className='text-icon' title={`${lang[2]} (${lang[1]})`} aria-hidden='true'>
      {lang[0].toUpperCase()}
    </span>
  );
};

LanguageIcon.propTypes = {
  language: PropTypes.string.isRequired,
};

class StatusIcons extends PureComponent {

  static propTypes = {
    status: ImmutablePropTypes.map.isRequired,
    mediaIcons: PropTypes.arrayOf(PropTypes.string),
    collapsible: PropTypes.bool,
    collapsed: PropTypes.bool,
    setCollapsed: PropTypes.func.isRequired,
    intl: PropTypes.object.isRequired,
    settings: ImmutablePropTypes.map.isRequired,
  };

  //  Handles clicks on collapsed button
  handleCollapsedClick = (e) => {
    const { collapsed, setCollapsed } = this.props;
    if (e.button === 0) {
      setCollapsed(!collapsed);
      e.preventDefault();
    }
  };

  mediaIconTitleText (mediaIcon) {
    const { intl } = this.props;

    const message = {
      'link': messages.previewCard,
      'picture-o': messages.pictures,
      'tasks': messages.poll,
      'video-camera': messages.video,
      'music': messages.audio,
    }[mediaIcon];

    return message && intl.formatMessage(message);
  }

  renderIcon (mediaIcon) {
    return (
      <Icon
        fixedWidth
        className='status__media-icon'
        key={`media-icon--${mediaIcon}`}
        id={mediaIcon}
        aria-hidden='true'
        title={this.mediaIconTitleText(mediaIcon)}
      />
    );
  }

  render () {
    const {
      status,
      mediaIcons,
      collapsible,
      collapsed,
      settings,
      intl,
    } = this.props;

    return (
      <div className='status__info__icons'>
        {settings.get('language') && status.get('language') && <LanguageIcon language={status.get('language')} />}
        {settings.get('reply') && status.get('in_reply_to_id', null) !== null ? (
          <Icon
            className='status__reply-icon'
            id='comment'
            icon={ForumIcon}
            aria-hidden='true'
            title={intl.formatMessage(messages.inReplyTo)}
          />
        ) : null}
        {settings.get('local_only') && status.get('local_only') &&
          <Icon
            id='home'
            icon={HomeIcon}
            aria-hidden='true'
            title={intl.formatMessage(messages.localOnly)}
          />}
        {settings.get('media') && !!mediaIcons && mediaIcons.map(icon => this.renderIcon(icon))}
        {settings.get('visibility') && <VisibilityIcon visibility={status.get('visibility')} />}
        {collapsible && (
          <IconButton
            className='status__collapse-button'
            animate
            active={collapsed}
            title={
              collapsed ?
                intl.formatMessage(messages.uncollapse) :
                intl.formatMessage(messages.collapse)
            }
            icon='angle-double-up'
            iconComponent={ExpandLessIcon}
            onClick={this.handleCollapsedClick}
          />
        )}
      </div>
    );
  }

}

export default injectIntl(StatusIcons);
