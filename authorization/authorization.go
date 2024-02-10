package authorization

func CanPerformAction(
	actorId string,
	resourceId string,
	action string,
) bool {
	return true
}
