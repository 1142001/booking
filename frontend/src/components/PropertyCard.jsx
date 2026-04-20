const PropertyCard = ({ property, onBook }) => {
  return (
    <article className="property-card">
      <img
        src={property.images?.[0] || 'https://via.placeholder.com/600x400?text=Room+or+PG'}
        alt={property.title}
      />
      <div className="property-body">
        <h3>{property.title}</h3>
        <p>{property.description}</p>
        <p>
          <strong>Type:</strong> {property.type.toUpperCase()} | <strong>Location:</strong>{' '}
          {property.location}
        </p>
        <p>
          <strong>Rent:</strong> ₹{property.rentPerMonth}/month
        </p>
        <div className="chip-row">
          {property.amenities?.map((amenity) => (
            <span key={amenity} className="chip">
              {amenity}
            </span>
          ))}
        </div>
        <button className="primary-btn" type="button" onClick={() => onBook(property)}>
          Book Now
        </button>
      </div>
    </article>
  );
};

export default PropertyCard;
