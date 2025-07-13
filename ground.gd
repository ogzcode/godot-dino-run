extends ParallaxBackground

@export var scroll_speed_x: float = 300.0 # Kayma hızı (piksel/saniye)

func _process(delta: float) -> void:
	# Eğer klavyenin sağ tuşuna basılıyorsa
	if Input.is_action_pressed("ui_right"):
		# scroll_offset'in x eksenini scroll_speed_x ile azalt
		# delta (saniyeler) ile çarparak kare hızından bağımsız hareket sağlarız.
		scroll_offset.x -= scroll_speed_x * delta
