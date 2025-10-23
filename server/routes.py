#Notifications routes
@routes.route('/notifications', methods=['GET'])
def get_notifications():
    notes = Notification.query.all()
    return jsonify([n.to_dict() for n in notes]), 200

@routes.route('/notifications', methods=['POST'])
def create_notification():
    data = request.get_json()
    note = Notification(
        user_id=data['user_id'],
        message=data['message'],
        read_status=data.get('read_status', False)
    )
    db.session.add(note)
    db.session.commit()
    return jsonify(note.to_dict()), 201

#Usage Patterns routes
@routes.route('/usage-patterns', methods=['GET'])
def get_usage_patterns():
    patterns = UsagePattern.query.all()
    return jsonify([p.to_dict() for p in patterns]), 200

@routes.route('/usage-patterns', methods=['POST'])
def create_usage_pattern():
    data = request.get_json()
    pattern = UsagePattern(
        user_id=data['user_id'],
        action=data['action'],
        timestamp=data.get('timestamp')
    )
    db.session.add(pattern)
    db.session.commit()
    return jsonify(pattern.to_dict()), 201

