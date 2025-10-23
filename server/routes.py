@routes.route('/redemptions', methods=['GET'])
def get_redemptions():
    redemptions = Redemption.query.all()
    return jsonify([r.to_dict() for r in redemptions]), 200

@routes.route('/redemptions', methods=['POST'])
def create_redemption():
    data = request.get_json()
    red = Redemption(
        user_id=data['user_id'],
        reward=data['reward'],
        points_used=data['points_used']
    )
    db.session.add(red)
    db.session.commit()
    return jsonify(red.to_dict()), 201