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