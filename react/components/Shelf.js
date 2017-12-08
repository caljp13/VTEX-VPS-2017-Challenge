import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { FormattedMessage } from 'react-intl'
import ProductImage from './ProductImage'

class Shelf extends Component {
  render() {
    const { data } = this.props

    return (
      <div>
        {data.loading
          ? <FormattedMessage id="store-graphql.loading" />
          : data.products
            ? (
              <div className="cf pa2">
                {data.products.map(product => (
                  <div>
                    <div class="container">
                      {product.items.map(item => (
                        <div className="row">
                          <div className="col-xs1-12">
                            <table>
                              <tr>
                                <td> <img src={item.images[0].imageUrl} class="img-responsive mw4-m" /></td>
                                <td>
                                  <p>
                                    <p><strong>{item.nameComplete}</strong></p>
                                    preço: R$ {item.sellers[0].commertialOffer.Price}<br />
                                    Vendedor: <a href={`/seller-info?sellerId=${item.sellers[0].sellerId}`}>{item.sellers[0].sellerName}</a></p>
                                  <p><strong><a href={item.sellers[0].addToCartLink}>Comprar</a></strong></p>
                                </td>
                              </tr>
                              <tr><br/></tr>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )
            : <div>Empty</div>
        }
      </div>
    )
  }
}

Shelf.propTypes = {
  data: PropTypes.object.isRequired,
}

const query = gql`
  query Products(
    $query: String
    $category: String
    $specificationFilters: [String]
    $priceRange: String
    $collection: String
    $orderBy: String
    $from: Int
    $to: Int
    $salesChannel: String
  ) {
    products(
      query: $query
      category: $category
      specificationFilters: $specificationFilters
      priceRange: $priceRange
      collection: $collection
      orderBy: $orderBy
      from: $from
      to: $to
      salesChannel: $salesChannel
    ) {
      productId
      productName
      brand
      linkText
      productReference
      categoryId
      categories
      categoriesIds
      clusterHighlights {
        id
        name
      }
      link
      description
      items {
        itemId
        name
        nameComplete
        complementName
        ean,
        referenceId {
          Key
          Value
        }
        measurementUnit
        unitMultiplier
        images {
          imageId
          imageLabel
          imageTag
          imageUrl
          imageText
        }
        sellers {
          sellerId
          sellerName
          addToCartLink
          sellerDefault
          commertialOffer {
            Installments {
              Value
              InterestRate
              TotalValuePlusInterestRate
              NumberOfInstallments
              PaymentSystemName
              PaymentSystemGroupName
              Name
            }
            Price
            ListPrice
            PriceWithoutDiscount
            RewardValue
            PriceValidUntil
            AvailableQuantity
            Tax
            CacheVersionUsedToCallCheckout
            DeliverySlaSamples {
              DeliverySlaPerTypes {
                TypeName
                Price
                EstimatedTimeSpanToDelivery
              }
              Region {
                IsPersisted
                IsRemoved
                Id
                Name
                CountryCode
                ZipCode
                CultureInfoName
              }
            }
          }
        }
        variations {
          name
          values
        }
        attachments {
          id
          name
          required
          domainValues {
            FieldName
            MaxCaracters
            DomainValues
          }
        }
      }
      properties {
        name
        values
      }
      propertyGroups {
        name
        properties
      }
      recommendations {
        buy {
          productId
          productName
        }
        view {
          productId
          productName
        }
      }
    }
  }
`

const options = {
  options: ({ query = '', category = '', specificationFilters = '', priceRange = '', collection = '', orderBy = '', from = 0, to = 10, salesChannel = '' }) => ({
    variables: {
      query,
      category,
      specificationFilters: specificationFilters ? [specificationFilters] : [],
      priceRange,
      collection,
      orderBy,
      from,
      to,
      salesChannel,
    },
  }),
}

export default graphql(query, options)(Shelf)
