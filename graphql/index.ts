import gql from 'graphql-tag';

export const GET_SERIES = gql`
query GetSeries($code: String!) {
  series(code: $code) {
    id
    orderInSeries
    availableLanguages
  }
}
`;
