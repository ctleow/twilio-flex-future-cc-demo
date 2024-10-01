import { MessageListItem, withTaskContext } from '@twilio/flex-ui';
import { Message } from '@twilio/conversations';

import AdaptiveCardContainer from '../AdaptiveCardContainer';

type AdaptiveCardFlexWrapperProps = React.ComponentProps<typeof MessageListItem>;

const AdaptiveCardFlexWrapper = (props: Partial<AdaptiveCardFlexWrapperProps>) => {
  if (!props.message || !props.message.source) return null;
  return <AdaptiveCardContainer message={props.message.source as unknown as Message} />;
};

export default withTaskContext(AdaptiveCardFlexWrapper);
