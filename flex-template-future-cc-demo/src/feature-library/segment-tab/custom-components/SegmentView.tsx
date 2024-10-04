import React, { useEffect, useState } from 'react';
import { Box, Card, Column, Grid, Heading, Paragraph, Stack } from '@twilio-paste/core';
import { withTaskContext } from '@twilio/flex-ui';

import SegmentService from '../utils/SegmentService';
import { SegmentTraits } from '../types/Segment/SegmentTraits';
import { EventResponse } from '../types/Segment/EventResponse';
import FauxSuggestions from './FauxSuggestions';
import EngagementMetrics from './EngagementMetrics';
import TraitTags from './TraitTags';

type SegmentViewProps = {
  props: {
    task?: any;
  };
};

const SegmentView = ({ props }: SegmentViewProps) => {
  const task = props.task;

  const [isLoadingTraits, setLoadingTraits] = useState(true);
  const [isLoadingEvents, setLoadingEvents] = useState(true);
  const [traits, setTraits] = useState<SegmentTraits>({});
  const [events, setEvents] = useState<EventResponse[]>([]);

  useEffect(() => {
    setLoadingTraits(true);
    setLoadingEvents(true);

    const phone: string = props.task.attributes.From || props.task.attributes.from;
    if (phone && phone !== '')
      SegmentService.fetchTraitsForUserByPhone(phone)
        .then((userTraits) => setTraits(userTraits))
        .catch((err) => console.error('Segment view - Error fetching user traits by phone', err))
        .finally(() => setLoadingTraits(false));

    const email: string =
      props.task.attributes.email ||
      props.task.attributes?.customers?.email ||
      props.task.attributes?.pre_engagement_data?.email;
    if (email && email !== '') {
      SegmentService.fetchTraitsForUser(email)
        .then((userTraits) => setTraits(userTraits))
        .catch((err) => console.error('Segment view - Error fetching user traits by userId', err))
        .finally(() => setLoadingTraits(false));

      SegmentService.fetchEventsForUser(
        props.task.attributes.email ||
          props.task.attributes?.customers?.email ||
          props.task.attributes?.pre_engagement_data?.email,
      )
        .then((events) => setEvents(events))
        .catch((err) => console.log('Segment view - Error getting events by userId', err))
        .finally(() => setLoadingEvents(false));
    }
  }, [
    props.task?.attributes?.email,
    props.task?.attributes?.customers?.email,
    props.task.attributes?.pre_engagement_data?.email,
  ]);

  return (
    <Box as="main" padding="space70">
      <Grid gutter="space30">
        <Column span={6}>
          <Stack orientation={'vertical'} spacing="space50">
            {/* <CustomerInfo /> */}

            <Card padding="space70">
              <Heading as={'h2'} variant={'heading40'}>
                CDP Traits
              </Heading>
              <TraitTags loading={isLoadingTraits} traits={traits} />
            </Card>

            <Card padding="space70">
              <Heading as="h4" variant="heading40">
                TIP: Solve for the customer
              </Heading>
              <Paragraph>
                Rather than looking for shortcuts or handing the case off to another rep, be invested in the situation
                as the customer. Look for long-term solutions that foster customer success, not quick fixes that will
                require more attention later.
              </Paragraph>
            </Card>
          </Stack>
        </Column>

        <Column span={6}>
          <Stack orientation={'vertical'} spacing="space50">
            <Card padding="space70">
              <Heading as={'h2'} variant={'heading40'}>
                CDP Engagement Metrics
              </Heading>
              <EngagementMetrics loading={isLoadingTraits} traits={traits} />
            </Card>
            <Card padding="space70">
              <Heading as={'h2'} variant={'heading40'}>
                Proactive Knowledge
              </Heading>
              <FauxSuggestions />
            </Card>
          </Stack>
        </Column>
      </Grid>
    </Box>
  );
};

export default SegmentView;
